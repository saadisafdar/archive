#include <iostream>
#include <unistd.h>
#include <sys/wait.h>

using namespace std;

int main() {
    pid_t pid = fork();

    if (pid == 0) {
        cout << "Child finished" << endl;
    } else if (pid > 0) {
        wait(NULL);
        cout << "Parent finished" << endl;
    }

    return 0;
}
