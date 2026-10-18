#include <iostream>
#include <string>
#include <cctype>
#include <vector>
using namespace std;

class PasswordChecker {
private:
    string password;
    int strengthScore;
    
    bool hasUpperCase() {
        for (char c : password) {
            if (isupper(c)) return true;
        }
        return false;
    }
    
    bool hasLowerCase() {
        for (char c : password) {
            if (islower(c)) return true;
        }
        return false;
    }
    
    bool hasDigits() {
        for (char c : password) {
            if (isdigit(c)) return true;
        }
        return false;
    }
    
    bool hasSpecialChars() {
        string special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        for (char c : password) {
            if (special.find(c) != string::npos) return true;
        }
        return false;
    }
    
    void calculateStrength() {
        strengthScore = 0;
        
        // Length points
        if (password.length() >= 8) strengthScore += 2;
        if (password.length() >= 12) strengthScore += 2;
        if (password.length() >= 16) strengthScore += 2;
        
        // Character variety points
        if (hasUpperCase()) strengthScore += 2;
        if (hasLowerCase()) strengthScore += 2;
        if (hasDigits()) strengthScore += 2;
        if (hasSpecialChars()) strengthScore += 2;
        
        // Bonus for mixed case
        if (hasUpperCase() && hasLowerCase()) strengthScore += 1;
    }
    
    string getStrengthLevel() {
        if (strengthScore >= 12) return "💪 VERY STRONG";
        else if (strengthScore >= 9) return "👍 STRONG";
        else if (strengthScore >= 6) return "⚠️  MEDIUM";
        else if (strengthScore >= 3) return "👎 WEAK";
        else return "❌ VERY WEAK";
    }
    
    vector<string> getSuggestions() {
        vector<string> suggestions;
        
        if (password.length() < 8) {
            suggestions.push_back("➡️  Use at least 8 characters");
        }
        if (!hasUpperCase()) {
            suggestions.push_back("➡️  Add uppercase letters (A-Z)");
        }
        if (!hasLowerCase()) {
            suggestions.push_back("➡️  Add lowercase letters (a-z)");
        }
        if (!hasDigits()) {
            suggestions.push_back("➡️  Add numbers (0-9)");
        }
        if (!hasSpecialChars()) {
            suggestions.push_back("➡️  Add special characters (!@#$% etc.)");
        }
        if (password.length() < 12) {
            suggestions.push_back("➡️  Use 12+ characters for better security");
        }
        
        return suggestions;
    }

public:
    void checkPassword() {
        cout << "🔐 PASSWORD STRENGTH CHECKER 🔐" << endl;
        cout << "================================" << endl;
        
        cout << "Enter a password to check: ";
        getline(cin, password);
        
        calculateStrength();
        
        // Display results
        cout << "\n📊 ANALYSIS RESULTS:" << endl;
        cout << "====================" << endl;
        cout << "Password: " << string(password.length(), '*') << endl;
        cout << "Length: " << password.length() << " characters" << endl;
        cout << "Strength Score: " << strengthScore << "/14" << endl;
        cout << "Strength Level: " << getStrengthLevel() << endl;
        
        // Display features
        cout << "\n✅ FEATURES FOUND:" << endl;
        cout << "=================" << endl;
        cout << (hasUpperCase() ? "✓" : "✗") << " Uppercase letters" << endl;
        cout << (hasLowerCase() ? "✓" : "✗") << " Lowercase letters" << endl;
        cout << (hasDigits() ? "✓" : "✗") << " Numbers" << endl;
        cout << (hasSpecialChars() ? "✓" : "✗") << " Special characters" << endl;
        cout << (password.length() >= 8 ? "✓" : "✗") << " Minimum 8 characters" << endl;
        cout << (password.length() >= 12 ? "✓" : "✗") << " Recommended 12+ characters" << endl;
        
        // Display suggestions if needed
        vector<string> suggestions = getSuggestions();
        if (!suggestions.empty()) {
            cout << "\n💡 SUGGESTIONS FOR IMPROVEMENT:" << endl;
            cout << "==============================" << endl;
            for (const string& suggestion : suggestions) {
                cout << suggestion << endl;
            }
        }
        
        // Security tips
        cout << "\n🔒 SECURITY TIPS:" << endl;
        cout << "================" << endl;
        cout << "• Don't use personal information" << endl;
        cout << "• Avoid common words & patterns" << endl;
        cout << "• Use unique passwords for each account" << endl;
        cout << "• Consider using a password manager" << endl;
    }
};

int main() {
    PasswordChecker checker;
    char another;
    
    do {
        checker.checkPassword();
        
        cout << "\n🔄 Check another password? (y/n): ";
        cin >> another;
        cin.ignore(); // Clear input buffer
        
    } while (another == 'y' || another == 'Y');
    
    cout << "\nStay secure! 🔐" << endl;
    
    return 0;
}