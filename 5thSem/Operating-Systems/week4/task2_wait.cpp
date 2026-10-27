#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

using namespace std;

int main() {
    pid_t pid = fork();

    if (pid < 0) {
        cerr << "Fork failed!" << endl;
        return 1;
    } else if (pid == 0) {
        // Child process: prints 1 to 5
        for (int i = 1; i <= 5; ++i) {
            cout << "Child: " << i << endl;
        }
    } else {
        // Parent process: waits for child, then prints 6 to 10
        wait(NULL);
        for (int i = 6; i <= 10; ++i) {
            cout << "Parent: " << i << endl;
        }
    }

    return 0;
}
