#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
using namespace std;
int main() {
    int fd[2];

    if (pipe(fd) == -1) {
        cerr << "Pipe creation failed!" << endl;
        return 1;
    }

    pid_t pid = fork();

    if (pid < 0) {
        cerr << "Fork failed!" << endl;
        return 1;
    }

    if (pid > 0) {
        // Parent process
        close(fd[0]); // Close unused read end

        int a, b;
        cout << "Parent: Enter first integer: ";
        cin >> a;
        cout << "Parent: Enter second integer: ";
        cin >> b;

        write(fd[1], &a, sizeof(a));
        write(fd[1], &b, sizeof(b));

        close(fd[1]); // Close write end after sending
        wait(NULL);   // Wait for child to finish
    } else {
        // Child process
        close(fd[1]); // Close unused write end

        int num1, num2;
        read(fd[0], &num1, sizeof(num1));
        read(fd[0], &num2, sizeof(num2));

        int sum = num1 + num2;
        cout << "Child: Received " << num1 << " and " << num2 << endl;
        cout << "Child: Sum = " << sum << endl;

        close(fd[0]); // Close read end
    }
    return 0;
}
