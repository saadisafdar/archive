#include <iostream>
#include <pthread.h>
#include <unistd.h>

using namespace std;

void* task(void* arg) {
    int id = *(int*)arg;
    cout << "Thread " << id << " is executing. Thread ID: " << pthread_self() << endl;
    return nullptr;
}

int main() {
    pthread_t t1, t2, t3;
    int a = 1, b = 2, c = 3;

    pthread_create(&t1, nullptr, task, &a);
    pthread_create(&t2, nullptr, task, &b);
    pthread_create(&t3, nullptr, task, &c);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);
    pthread_join(t3, nullptr);

    cout << "All 3 threads completed." << endl;
    return 0;
}
