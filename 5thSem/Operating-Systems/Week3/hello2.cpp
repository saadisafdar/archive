#include <iostream>
#include <string>
#include <unistd.h>

using namespace std;

int main() {
    string name;

    cout << "Enter your name: ";
    getline(cin, name);

    for (int i = 0; i < 3; i++) {
        cout << "Name: " << name << " | PID: " << getpid() << endl;
    }

    return 0;
}
