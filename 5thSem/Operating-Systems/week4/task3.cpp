#include <iostream>
#include <cstdlib>
#include <cstring>
#include <unistd.h>
#include <sys/wait.h>
using namespace std;

int main()
{
    int fd[2];
    char buf[100] = {0};
    if (pipe(fd) == -1)
    { perror("pipe"); exit(1); }

    pid_t pid = fork();
    if (pid < 0) { perror("fork"); exit(1); }

    if (pid > 0) {
        close(fd[0]);
        const char *msg = "Hello child, this is your parent";
        if (write(fd[1], msg, strlen(msg) + 1) == -1) perror("write");
        close(fd[1]);
        wait(NULL);
    } else {
        close(fd[1]);
        ssize_t n = read(fd[0], buf, sizeof(buf) - 1);
        if (n == -1) { perror("read"); exit(1); }
        cout << "Child received: " << buf << endl;
        close(fd[0]);
    }
    return 0;
}
