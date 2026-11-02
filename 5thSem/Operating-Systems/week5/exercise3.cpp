#include <iostream>
#include <pthread.h>

using namespace std;

int counter = 0;

void* increase(void* arg) {
    for (int i = 1; i <= 1000000; i++) {
        counter++; // Unprotected shared resource access
    }
    return nullptr;
}

int main() {
    pthread_t t1, t2;

    pthread_create(&t1, nullptr, increase, nullptr);
    pthread_create(&t2, nullptr, increase, nullptr);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);

    cout << "Final counter = " << counter << endl;
    return 0;
}
