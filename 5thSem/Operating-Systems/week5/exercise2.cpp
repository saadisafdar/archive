#include <iostream>
#include <pthread.h>

using namespace std;

int numbers[12] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
int sum1 = 0, sum2 = 0, sum3 = 0;

void* task1(void* arg) {
    for (int i = 0; i < 4; i++) { // Indices 0 to 3
        sum1 += numbers[i];
    }
    return nullptr;
}

void* task2(void* arg) {
    for (int i = 4; i < 8; i++) { // Indices 4 to 7
        sum2 += numbers[i];
    }
    return nullptr;
}

void* task3(void* arg) {
    for (int i = 8; i < 12; i++) { // Indices 8 to 11
        sum3 += numbers[i];
    }
    return nullptr;
}

int main() {
    pthread_t t1, t2, t3;

    pthread_create(&t1, nullptr, task1, nullptr);
    pthread_create(&t2, nullptr, task2, nullptr);
    pthread_create(&t3, nullptr, task3, nullptr);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);
    pthread_join(t3, nullptr);

    int total = sum1 + sum2 + sum3;

    cout << "Part 1 Sum (1-4): " << sum1 << endl;
    cout << "Part 2 Sum (5-8): " << sum2 << endl;
    cout << "Part 3 Sum (9-12): " << sum3 << endl;
    cout << "Total Sum: " << total << endl;

    return 0;
}
