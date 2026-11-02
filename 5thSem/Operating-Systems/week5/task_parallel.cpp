#include <iostream>
#include <pthread.h>
using namespace std;
int numbers[5] = {4, 8, 2, 9, 5};
int total = 0;
int largest = 0;
void* find_sum(void* arg) {
    for (int i = 0; i < 5; i++) {
        total = total + numbers[i];
    }
    return nullptr;
}
void* find_max(void* arg) {
    largest = numbers[0];

    for (int i = 1; i < 5; i++) {
        if (numbers[i] > largest) {
            largest = numbers[i];
        }
    }
    return nullptr;
}
int main() {
    pthread_t t1, t2;

    pthread_create(&t1, nullptr, find_sum, nullptr);
    pthread_create(&t2, nullptr, find_max, nullptr);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);

    cout << "Sum = " << total << endl;
    cout << "Largest = " << largest << endl;
    return 0;
}
