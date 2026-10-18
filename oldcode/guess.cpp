#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(0)); // seed random number generator
    int secret = rand() % 100 + 1; // random number between 1 and 100
    int guess;
    int tries = 0;

    cout << "Guess the number (1–100): ";

    do {
        cin >> guess;
        tries++;

        if (guess > secret)
            cout << "Too high! Try again: ";
        else if (guess < secret)
            cout << "Too low! Try again: ";
        else
            cout << "Correct! You guessed it in " << tries << " tries." << endl;

    } while (guess != secret);

    return 0;
}
