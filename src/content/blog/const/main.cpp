
void f(int &);
void f(const int &);

void k(int);
void k(const int &);

int main(void) {

  int x = 0;
  const int y = 0;

  f(x); // OK: calls f(int &)
  f(y); // OK: calls f(const int &)

  k(x); // Error: ambiguous
}
