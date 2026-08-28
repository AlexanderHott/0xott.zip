#include <print>
#include <vector>

void do_something(const std::vector<int>& data) {
    std::println("Length: {}", data.size());
}

int main() {
    std::vector<int> data(1024 * 4);
    do_something(data);

    std::println("Length: {}", data.size());
}
