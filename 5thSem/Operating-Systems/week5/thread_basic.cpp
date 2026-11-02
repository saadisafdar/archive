#include <iostream>
#include <pthread.h>
#include <unistd.h>

using namespace std;

void* task1(void* arg) {
    for (int i = 1; i <= 3; i++) {
        cout << "Thread 1: " << i << endl;
    }
    return nullptr; // Placed outside the loop
}

void* task2(void* arg) {
    for (int i = 1; i <= 3; i++) {
        cout << "Thread 2: " << i << endl;
    }
    return nullptr; // Placed outside the loop
}

int main() {
    pthread_t t1, t2;

    pthread_create(&t1, nullptr, task1, nullptr);
    pthread_create(&t2, nullptr, task2, nullptr);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);

    cout << "Both threads completed." << endl;

    return 0;
}
