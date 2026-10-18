#include <iostream>
#include <cstdlib>
#include <ctime>
#include <vector>
#include <map>
using namespace std;

int main() {
    srand(time(0)); // Seed random number generator
    int numDice, numSides, numRolls;
    char rollAgain;
    
    cout << "🎲 DICE ROLLING SIMULATOR 🎲" << endl;
    cout << "============================" << endl;
    
    do {
        cout << "\nEnter number of dice: ";
        cin >> numDice;
        cout << "Enter number of sides per die: ";
        cin >> numSides;
        cout << "Enter number of rolls: ";
        cin >> numRolls;
        
        // Input validation
        if (numDice <= 0 || numSides <= 0 || numRolls <= 0) {
            cout << "❌ Please enter positive numbers only!" << endl;
            continue;
        }
        
        vector<int> results;
        map<int, int> frequency;
        int totalSum = 0;
        
        cout << "\n🎯 ROLLING " << numDice << " DICE (" << numSides << " sides) " 
             << numRolls << " TIMES..." << endl;
        cout << "=====================================" << endl;
        
        // Roll the dice
        for (int roll = 0; roll < numRolls; roll++) {
            int rollSum = 0;
            cout << "Roll " << (roll + 1) << ": ";
            
            for (int die = 0; die < numDice; die++) {
                int rollValue = rand() % numSides + 1;
                rollSum += rollValue;
                cout << rollValue;
                if (die < numDice - 1) cout << " + ";
            }
            
            cout << " = " << rollSum << endl;
            
            results.push_back(rollSum);
            frequency[rollSum]++;
            totalSum += rollSum;
        }
        
        // Calculate statistics
        double average = static_cast<double>(totalSum) / numRolls;
        
        // Find min and max
        int minRoll = results[0], maxRoll = results[0];
        for (int sum : results) {
            if (sum < minRoll) minRoll = sum;
            if (sum > maxRoll) maxRoll = sum;
        }
        
        // Display statistics
        cout << "\n📊 STATISTICS:" << endl;
        cout << "==============" << endl;
        cout << "Total sum: " << totalSum << endl;
        cout << "Average roll: " << average << endl;
        cout << "Minimum roll: " << minRoll << endl;
        cout << "Maximum roll: " << maxRoll << endl;
        
        // Display frequency
        cout << "\n📈 ROLL FREQUENCY:" << endl;
        cout << "=================" << endl;
        for (auto& [rollValue, count] : frequency) {
            cout << rollValue << ": " << count << " time(s) ";
            // Simple bar chart
            for (int i = 0; i < count && i < 20; i++) cout << "█";
            cout << endl;
        }
        
        // Ask to play again
        cout << "\n🔄 Roll again with different settings? (y/n): ";
        cin >> rollAgain;
        
    } while (rollAgain == 'y' || rollAgain == 'Y');
    
    cout << "\nThanks for using Dice Simulator! 🎲" << endl;
    
    return 0;
}