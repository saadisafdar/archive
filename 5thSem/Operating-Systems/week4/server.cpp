#include <iostream>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>
using namespace std;

#define REQ "/tmp/lab4_req"
#define RESP "/tmp/lab4_resp"

int main() {
    int n, result;

    mkfifo(REQ, 0666);
    mkfifo(RESP, 0666);

    cout << "Server: waiting for request..." << endl;

    int rfd = open(REQ, O_RDONLY);
    read(rfd, &n, sizeof(n));
    cout << "Server: received " << n << endl;

    result = n * n;

    int wfd = open(RESP, O_WRONLY);
    write(wfd, &result, sizeof(result));
    cout << "Server: sent reply " << result << endl;

    close(rfd);
    close(wfd);

    unlink(REQ);
    unlink(RESP);

    return 0;
}
