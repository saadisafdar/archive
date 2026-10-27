#include <iostream>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
using namespace std;

#define REQ "/tmp/lab4_req"
#define RESP "/tmp/lab4_resp"

int main() {
    int num1, num2, sum;

    mkfifo(REQ, 0666);
    mkfifo(RESP, 0666);

    cout << "Server: waiting for request..." << endl;

    int rfd = open(REQ, O_RDONLY);
    read(rfd, &num1, sizeof(num1));
    read(rfd, &num2, sizeof(num2));
    cout << "Server: received " << num1 << " and " << num2 << endl;

    sum = num1 + num2;

    int wfd = open(RESP, O_WRONLY);
    write(wfd, &sum, sizeof(sum));
    cout << "Server: sent reply sum = " << sum << endl;

    close(rfd);
    close(wfd);

    unlink(REQ);
    unlink(RESP);

    return 0;
}
