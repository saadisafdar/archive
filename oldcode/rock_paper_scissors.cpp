#include <iostream>
#include <cstdlib>
#include <ctime>
using namespace std;

int main() {
    srand(time(0)); // Seed random number generator
    
    int userChoice, computerChoice;
    int userScore = 0, computerScore = 0;
    char playAgain;
    
    cout << "🎮 Welcome to Rock Paper Scissors! 🎮" << endl;
    cout << "=====================================" << endl;
    
    do {
        cout << "\nChoose your move:" << endl;
        cout << "1. Rock 🪨" << endl;
        cout << "2. Paper 📄" << endl;
        cout << "3. Scissors ✂️" << endl;
        cout << "Enter your choice (1-3): ";
        cin >> userChoice;
        
        // Validate input
        if (userChoice < 1 || userChoice > 3) {
            cout << "❌ Invalid choice! Please enter 1, 2, or 3." << endl;
            continue;
        }
        
        // Computer chooses randomly (1-3)
        computerChoice = rand() % 3 + 1;
        
        // Display choices
        cout << "\nYou chose: ";
        switch(userChoice) {
            case 1: cout << "Rock 🪨"; break;
            case 2: cout << "Paper 📄"; break;
            case 3: cout << "Scissors ✂️"; break;
        }
        
        cout << "\nComputer chose: ";
        switch(computerChoice) {
            case 1: cout << "Rock 🪨"; break;
            case 2: cout << "Paper 📄"; break;
            case 3: cout << "Scissors ✂️"; break;
        }
        cout << endl;
        
        // Determine winner
        if (userChoice == computerChoice) {
            cout << "🤝 It's a tie!" << endl;
        } else if ((userChoice == 1 && computerChoice == 3) || // Rock vs Scissors
                   (userChoice == 2 && computerChoice == 1) || // Paper vs Rock
                   (userChoice == 3 && computerChoice == 2)) { // Scissors vs Paper
            cout << "🎉 You win this round!" << endl;
            userScore++;
        } else {
            cout << "💻 Computer wins this round!" << endl;
            computerScore++;
        }
        
        // Display scores
        cout << "\n📊 SCOREBOARD:" << endl;
        cout << "You: " << userScore << " | Computer: " << computerScore << endl;
        
        // Ask to play again
        cout << "\nPlay again? (y/n): ";
        cin >> playAgain;
        
    } while (playAgain == 'y' || playAgain == 'Y');
    
    // Final results
    cout << "\n🎊 FINAL RESULTS 🎊" << endl;
    cout << "Your score: " << userScore << endl;
    cout << "Computer score: " << computerScore << endl;
    
    if (userScore > computerScore) {
        cout << "🏆 YOU ARE THE CHAMPION! 🏆" << endl;
    } else if (computerScore > userScore) {
        cout << "🤖 Computer wins the game!" << endl;
    } else {
        cout << "🤝 The game is a tie!" << endl;
    }
    
    cout << "\nThanks for playing! 👋" << endl;
    
    return 0;
}