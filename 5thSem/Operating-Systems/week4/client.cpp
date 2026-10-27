#include <iostream>
#include <fcntl.h>
#include <unistd.h>
using namespace std;

#define REQ "/tmp/lab4_req"
#define RESP "/tmp/lab4_resp"

int main() {
    int n, result;

    cout << "Client: enter a number: ";
    cin >> n;

    int wfd = open(REQ, O_WRONLY);
    write(wfd, &n, sizeof(n));

    int rfd = open(RESP, O_RDONLY);
    read(rfd, &result, sizeof(result));

    cout << "Client: square of " << n << " is " << result << endl;

    close(wfd);
    close(rfd);

    return 0;
}
