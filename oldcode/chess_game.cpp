#include <iostream>
#include <vector>
#include <string>
#include <cctype>
using namespace std;

class ChessGame {
private:
    vector<vector<char>> board;
    bool whiteTurn;
    
    void initializeBoard() {
        // Initialize empty board
        board = vector<vector<char>>(8, vector<char>(8, '.'));
        
        // Set up pawns
        for (int i = 0; i < 8; i++) {
            board[1][i] = 'P'; // White pawns
            board[6][i] = 'p'; // Black pawns
        }
        
        // Set up other pieces (white - uppercase, black - lowercase)
        // Rooks
        board[0][0] = board[0][7] = 'R';
        board[7][0] = board[7][7] = 'r';
        
        // Knights
        board[0][1] = board[0][6] = 'N';
        board[7][1] = board[7][6] = 'n';
        
        // Bishops
        board[0][2] = board[0][5] = 'B';
        board[7][2] = board[7][5] = 'b';
        
        // Queens
        board[0][3] = 'Q';
        board[7][3] = 'q';
        
        // Kings
        board[0][4] = 'K';
        board[7][4] = 'k';
    }
    
    void displayBoard() {
        cout << "\n  a b c d e f g h" << endl;
        cout << "  ----------------" << endl;
        
        for (int row = 0; row < 8; row++) {
            cout << 8 - row << "|";
            for (int col = 0; col < 8; col++) {
                cout << board[row][col] << " ";
            }
            cout << "|" << 8 - row << endl;
        }
        
        cout << "  ----------------" << endl;
        cout << "  a b c d e f g h" << endl;
        
        cout << "\nTurn: " << (whiteTurn ? "WHITE" : "BLACK") << endl;
        cout << "Pieces: P=Pawn, R=Rook, N=Knight, B=Bishop, Q=Queen, K=King" << endl;
        cout << "(Uppercase = White, Lowercase = Black)" << endl;
    }
    
    bool isValidMove(int fromRow, int fromCol, int toRow, int toCol) {
        // Basic validation
        if (fromRow < 0 || fromRow > 7 || fromCol < 0 || fromCol > 7 ||
            toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7) {
            return false;
        }
        
        char piece = board[fromRow][fromCol];
        
        // Check if piece exists
        if (piece == '.') return false;
        
        // Check if it's the correct player's turn
        if (whiteTurn && islower(piece)) return false;
        if (!whiteTurn && isupper(piece)) return false;
        
        // Check if destination has own piece
        char target = board[toRow][toCol];
        if (whiteTurn && isupper(target)) return false;
        if (!whiteTurn && islower(target)) return false;
        
        // Basic pawn movement (simplified)
        if (toupper(piece) == 'P') {
            return isValidPawnMove(fromRow, fromCol, toRow, toCol);
        }
        
        return true; // Simplified validation for other pieces
    }
    
    bool isValidPawnMove(int fromRow, int fromCol, int toRow, int toCol) {
        int direction = whiteTurn ? 1 : -1;
        
        // Move forward one square
        if (fromCol == toCol && toRow == fromRow + direction && 
            board[toRow][toCol] == '.') {
            return true;
        }
        
        // Move forward two squares from starting position
        if (fromCol == toCol && 
            ((whiteTurn && fromRow == 1 && toRow == 3) || 
             (!whiteTurn && fromRow == 6 && toRow == 4)) &&
            board[toRow][toCol] == '.' && board[fromRow + direction][fromCol] == '.') {
            return true;
        }
        
        // Capture diagonally
        if (abs(fromCol - toCol) == 1 && toRow == fromRow + direction &&
            board[toRow][toCol] != '.' && 
            ((whiteTurn && islower(board[toRow][toCol])) || 
             (!whiteTurn && isupper(board[toRow][toCol])))) {
            return true;
        }
        
        return false;
    }
    
    void makeMove(int fromRow, int fromCol, int toRow, int toCol) {
        board[toRow][toCol] = board[fromRow][fromCol];
        board[fromRow][fromCol] = '.';
    }
    
    bool isCheck() {
        // Simplified - always return false for basic version
        return false;
    }
    
    bool isCheckmate() {
        // Simplified - always return false for basic version
        return false;
    }

public:
    ChessGame() : whiteTurn(true) {
        initializeBoard();
    }
    
    void play() {
        cout << "♟️ WELCOME TO CHESS! ♟️" << endl;
        cout << "=====================" << endl;
        
        while (true) {
            displayBoard();
            
            if (isCheck()) {
                cout << "⚠️  CHECK!" << endl;
            }
            
            if (isCheckmate()) {
                cout << "🏁 CHECKMATE! " << (whiteTurn ? "BLACK" : "WHITE") << " WINS!" << endl;
                break;
            }
            
            string move;
            cout << "\nEnter your move (e.g., 'e2 e4' or 'quit' to exit): ";
            getline(cin, move);
            
            if (move == "quit" || move == "exit") {
                cout << "Thanks for playing!" << endl;
                break;
            }
            
            // Parse move (basic parsing)
            if (move.length() < 5) {
                cout << "❌ Invalid move format! Use 'e2 e4'" << endl;
                continue;
            }
            
            int fromCol = tolower(move[0]) - 'a';
            int fromRow = 8 - (move[1] - '0');
            int toCol = tolower(move[3]) - 'a';
            int toRow = 8 - (move[4] - '0');
            
            if (isValidMove(fromRow, fromCol, toRow, toCol)) {
                makeMove(fromRow, fromCol, toRow, toCol);
                whiteTurn = !whiteTurn; // Switch turns
            } else {
                cout << "❌ Invalid move! Try again." << endl;
            }
        }
    }
};

int main() {
    ChessGame game;
    game.play();
    return 0;
}