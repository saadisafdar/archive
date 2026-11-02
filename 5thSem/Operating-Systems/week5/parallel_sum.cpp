#include <iostream>
#include <pthread.h>
#include <unistd.h>

using namespace std;

int numbers[8] = {1, 2, 3, 4, 5, 6, 7, 8};
int sum1 = 0;
int sum2 = 0;

void* task1(void* arg) {
    for (int i = 0; i < 4; i++) {
        sum1 += numbers[i];
    }
    return nullptr;
}

void* task2(void* arg) {
    for (int i = 4; i < 8; i++) {
        sum2 += numbers[i];
    }
    return nullptr;
}

int main() {
    pthread_t t1, t2;

    pthread_create(&t1, nullptr, task1, nullptr);
    pthread_create(&t2, nullptr, task2, nullptr);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);

    int total = sum1 + sum2;

    cout << "First Sum: " << sum1 << endl;
    cout << "Second Sum: " << sum2 << endl;
    cout << "Total: " << total << endl;

    return 0;
}
