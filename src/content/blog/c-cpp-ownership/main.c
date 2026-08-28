#include <assert.h>
#include <stdbool.h>
#include <limits.h>
#include <stddef.h>
#include <stdarg.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef uint8_t u8;
typedef uint16_t u16;
typedef uint32_t u32;
typedef uint64_t u64;

typedef int8_t i8;
typedef int16_t i16;
typedef int32_t i32;
typedef int64_t i64;

typedef size_t usize;

#define U8_MAX UINT8_MAX
#define U16_MAX UINT16_MAX
#define U32_MAX UINT32_MAX
#define U64_MAX UINT64_MAX

#define I8_MIN INT8_MIN
#define I16_MIN INT16_MIN
#define I32_MIN INT32_MIN
#define I64_MIN INT64_MIN

#define I8_MAX INT8_MAX
#define I16_MAX INT16_MAX
#define I32_MAX INT32_MAX
#define I64_MAX INT64_MAX

#define USIZE_MAX SIZE_MAX

#define ASSERT(condition, message) assert((condition) && (message))

typedef struct String String;
struct String {
    char *buffer;
    usize length;
    usize capacity;
};

String string_new() {
    return ( String){
        .buffer = NULL,
        .length = 0,
        .capacity = 0,
    };
}

usize next_power_of_two(const usize value) {
    if (value <= 256) {
        return 256;
    }

    ASSERT(value <= (USIZE_MAX >> 1) + 1, "String capacity overflow");
    u32 bit_count = (u32) (sizeof(unsigned long long) * CHAR_BIT);
    u32 leading_zeros = (u32) __builtin_clzll((unsigned long long) (value - 1));
    u32 shift = bit_count - leading_zeros;
    return (usize) 1 << shift;
}

void string_reserve(String *string, const usize minimum_capacity) {
    if (minimum_capacity <= string->capacity) {
        return;
    }

    const usize capacity = next_power_of_two(minimum_capacity);
    char *buffer = realloc(string->buffer, capacity * sizeof(*buffer));
    ASSERT(buffer != NULL, "Failed to grow String");

    string->buffer = buffer;
    string->capacity = capacity;
}

void string_push_buffer(String *string, const char *buffer, const usize length) {
    ASSERT(buffer != NULL || length == 0, "Cannot push a null buffer");
    ASSERT(length <= USIZE_MAX - string->length, "String length overflow");

    usize length_old = string->length;
    usize length_new = length_old + length;

    usize buffer_offset = 0;
    bool buffer_is_internal = false;
    if (string->buffer != NULL) {
        uintptr_t buffer_address = (uintptr_t) buffer;
        uintptr_t string_address = (uintptr_t) string->buffer;
        buffer_is_internal = buffer_address >= string_address &&
                             buffer_address <= string_address + length_old;
        if (buffer_is_internal) {
            buffer_offset = buffer_address - string_address;
        }
    }

    string_reserve(string, length_new);
    if (buffer_is_internal) {
        buffer = string->buffer + buffer_offset;
    }

    if (length > 0) {
        memmove(string->buffer + length_old, buffer, length);
    }
    string->length = length_new;
}

String string_from_cstr(const char *cstr) {
    const usize length = strlen(cstr);
    const usize capacity = next_power_of_two(length);

    char *buffer = malloc(capacity * sizeof(*buffer));
    ASSERT(buffer != NULL, "Failed to allocate String");
    memcpy(buffer, cstr, length);

    return (struct String){
        .buffer = buffer,
        .length = length,
        .capacity = capacity,
    };
}

void string_push_cstr(String *string, const char *cstr) {
    string_push_buffer(string, cstr, strlen(cstr));
}

i32 string_push_format(String *string, const char *format, ...) {
    va_list arguments;
    va_start(arguments, format);
    i32 formatted_length = vsnprintf(NULL, 0, format, arguments);
    va_end(arguments);

    if (formatted_length < 0) {
        return formatted_length;
    }

    ASSERT((usize)formatted_length < USIZE_MAX - string->length,
           "String length overflow");
    string_reserve(string, string->length + (usize) formatted_length + 1);

    va_start(arguments, format);
    vsnprintf(string->buffer + string->length,
              (usize) formatted_length + 1,
              format,
              arguments);
    va_end(arguments);

    string->length += (usize) formatted_length;
    return formatted_length;
}

void string_delete(String *string) {
    if (string->buffer != NULL) {
        free(string->buffer);
        string->buffer = NULL;
    }
    string->length = 0;
    string->capacity = 0;
}

typedef struct StringSlice StringSlice;
struct StringSlice {
    char *buffer;
    usize length;
};

void string_push_string_view(String *string, const StringSlice *string_view) {
    string_push_buffer(string, string_view->buffer, string_view->length);
}

StringSlice string_slice_from_string(const String *string) {
    return ( StringSlice){
        .buffer = string->buffer,
        .length = string->length,
    };
}

#define string_slice_from_literal(cstr) ((StringSlice){ .buffer = (cstr), .length = sizeof(cstr) - 1, })

bool string_slice_compare(StringSlice *string_slice, const StringSlice *other) {
    if (string_slice->length != other->length) {
        return false;
    }
    for (usize i = 0; i < string_slice->length; ++i) {
        if (string_slice->buffer[i] != other->buffer[i]) {
            return false;
        }
    }
    return true;
}

typedef struct StringSliceFindResult StringSliceFindResult;
struct StringSliceFindResult {
    usize index;
    bool ok;
};

StringSliceFindResult
string_slice_find(const StringSlice *string_slice, const char target) {
    for (usize i = 0; i < string_slice->length; ++i) {
        if (string_slice->buffer[i] == target) {
            return ( StringSliceFindResult){
                .ok = true,
                .index = i,
            };
        }
    }

    return ( StringSliceFindResult){
        .ok = false,
        .index = 0,
    };
}

enum HttpMethod {
    HttpMethod_GET,
    HttpMethod_POST,

    HttpMethod_COUNT,
};

typedef struct HttpMethodParseResult HttpMethodParseResult;
struct HttpMethodParseResult {
    enum HttpMethod method;
    bool ok;
};

HttpMethodParseResult http_method_parse(StringSlice *slice) {
    if (string_slice_compare(slice, &string_slice_from_literal("GET"))) {
        return ( HttpMethodParseResult){
            .ok = true,
            .method = HttpMethod_GET,
        };
    }
    if (string_slice_compare(slice, &string_slice_from_literal("POST"))) {
        return ( HttpMethodParseResult){
            .ok = true,
            .method = HttpMethod_POST,
        };
    }

    return ( HttpMethodParseResult){
        .ok = false,
        .method = HttpMethod_COUNT,
    };
}

void http_method_debug(String *string, enum HttpMethod method) {
    switch (method) {
        case HttpMethod_GET: {
            string_push_cstr(string, "GET");
        }
        break;
        case HttpMethod_POST: {
            string_push_cstr(string, "POST");
        }
        break;
        default: {
            ASSERT(false, "Unreachable");
        }
    }
}

typedef struct Request Request;
struct Request {
    enum HttpMethod method;
    StringSlice path;
    StringSlice version;
};

String buffer_recieve() {
    const String buffer = string_from_cstr("GET / HTTP/1.1\r\n");
    return buffer;
}

Request parse_request() {
    String buffer = buffer_recieve();

    StringSlice slice = string_slice_from_string(&buffer);

    StringSliceFindResult find = string_slice_find(&slice, ' ');
    ASSERT(find.ok, "No space after method in HTTP request");

    StringSlice method_slice = (struct StringSlice){
        .buffer = slice.buffer,
        .length = find.index,
    };

    HttpMethodParseResult method_result = http_method_parse(&method_slice);
    ASSERT(method_result.ok, "Invalid HTTP method");

    slice.buffer = slice.buffer + find.index + 1;
    slice.length = slice.length - find.index - 1;

    find = string_slice_find(&slice, ' ');
    ASSERT(find.ok, "No space after path in HTTP request");

    StringSlice path_slice = (struct StringSlice){
        .buffer = slice.buffer,
        .length = find.index,
    };

    slice.buffer = slice.buffer + find.index + 1;
    slice.length = slice.length - find.index - 1;

    find = string_slice_find(&slice, '\r');
    ASSERT(find.ok, "First line missing \\r");

    StringSlice version_slice = (struct StringSlice){
        .buffer = slice.buffer,
        .length = find.index,
    };


    Request request = {
        .method = method_result.method,
        .path = path_slice,
        .version = version_slice,
    };

    string_delete(&buffer);

    return request;
}

int main() {
    Request request = parse_request(request_arena);


    String string = string_new();

    string_push_cstr(&string, "Request { .method = ");
    http_method_debug(&string, request.method);

    string_push_cstr(&string, ", .path = ");
    string_push_string_view(&string, &request.path);

    string_push_cstr(&string, ", .version = ");
    string_push_string_view(&string, &request.version);
    string_push_cstr(&string, " } ");
    string_push_cstr(&string, "\0");

    printf("%s\n", string.buffer);

    string_delete(&string);



    return 0;
}
