#include <iostream>
#include <fcntl.h>
#include <unistd.h>
using namespace std;

#define REQ "/tmp/lab4_req"
#define RESP "/tmp/lab4_resp"

int main() {
    int num1, num2, sum;

    cout << "Client: enter first number: ";
    cin >> num1;
    cout << "Client: enter second number: ";
    cin >> num2;

    int wfd = open(REQ, O_WRONLY);
    write(wfd, &num1, sizeof(num1));
    write(wfd, &num2, sizeof(num2));

    int rfd = open(RESP, O_RDONLY);
    read(rfd, &sum, sizeof(sum));

    cout << "Client: sum of " << num1 << " and " << num2 << " is " << sum << endl;

    close(wfd);
    close(rfd);

    return 0;
}
