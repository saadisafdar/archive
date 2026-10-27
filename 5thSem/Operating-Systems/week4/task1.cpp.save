#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

using namespace std;

int main() {
    cout << "Parent Process: PID = " << getpid() << ", Parent PID (PPID) = " << getppid() << endl;

    pid_t pid = fork();

    if (pid < 0) {
        cerr << "Fork failed!" << endl;
        return 1;
    } else if (pid == 0) {
        // Child Process
        cout << "Child Process:  PID = " << getpid() << ", Parent PID (PPID) = " << getppid() << endl;
        cout << "Child going to sleep for 30 seconds..." << endl;
        sleep(30);
    } else {
        // Parent Process
        wait(NULL); // Wait for child process to finish
    }

    return 0;
}
