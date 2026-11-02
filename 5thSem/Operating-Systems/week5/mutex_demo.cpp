#include <iostream>
#include <pthread.h>
using namespace std;

int counter = 0;
//pthread_mutex_t myLock;

void* increase(void* arg) {
    for (int i = 1; i <= 10000009; i++) {

  //      pthread_mutex_lock(&myLock);
        counter++;
    //    pthread_mutex_unlock(&myLock);
    }
    return nullptr;
}
int main() {

    pthread_t t1, t2;
    //pthread_mutex_init(&myLock, nullptr);

    pthread_create(&t1, nullptr, increase, nullptr);
    pthread_create(&t2, nullptr, increase, nullptr);

    pthread_join(t1, nullptr);
    pthread_join(t2, nullptr);

    cout << "Final counter = " << counter << endl;

    //pthread_mutex_destroy(&myLock);
    return 0;}
