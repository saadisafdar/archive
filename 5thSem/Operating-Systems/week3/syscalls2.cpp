#include <iostream>
#include <string>
#include <fcntl.h>
#include <unistd.h>

using namespace std;

int main() {
    string name;

    cout << "Enter your name: ";
    getline(cin, name);

    name += "\n";

    int fd = open("myname.txt", O_CREAT | O_WRONLY | O_TRUNC, 0644);
    if (fd != -1) {
        write(fd, name.c_str(), name.length());
        close(fd);
        cout << "Name saved to myname.txt successfully." << endl;
    } else {
        cerr << "Error opening file." << endl;
    }

    return 0;
}
