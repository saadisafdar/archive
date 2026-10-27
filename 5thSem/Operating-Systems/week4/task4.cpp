#include <iostream>
#include <cstdlib>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

using namespace std;

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        cerr << "Fork failed!" << endl;
        return 1;
    }

    if (pid == 0) {
        // Child process: exits immediately
        cout << "Child process (PID: " << getpid() << ") exiting..." << endl;
        exit(0);
    } else {
        // Parent process: sleeps before calling wait()
        cout << "Parent process (PID: " << getpid() << ") sleeping for 30 seconds..." << endl;
        sleep(30);

        // Calling wait() cleans up the zombie child
        cout << "Parent calling wait()..." << endl;
        wait(NULL);
        cout << "Child reaped. Parent exiting." << endl;
    }

    return 0;
}
