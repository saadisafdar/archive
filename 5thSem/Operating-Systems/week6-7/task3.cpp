#include <iostream>
using namespace std;

int main() {
    int n, quantum;
    int at[20], bt[20], rt[20];
    int ct[20], wt[20], tat[20];
    int added[20] = {0};
    int queue[20];
    int front = 0, rear = 0;
    int count = 0;
    int time = 0;
    int completed = 0;

    cout << "Enter number of processes: ";
    cin >> n;

    for (int i = 0; i < n; i++) {
        cout << "Enter Arrival Time of P" << i + 1 << ": ";
        cin >> at[i];
        cout << "Enter Burst Time of P" << i + 1 << ": ";
        cin >> bt[i];
        rt[i] = bt[i];
    }

    cout << "Enter Time Quantum: ";
    cin >> quantum;

    if (quantum <= 0) {
        cout << "Time quantum must be positive.";
        return 0;
    }

    while (completed < n) {
        for (int i = 0; i < n; i++) {
            if (at[i] <= time && added[i] == 0) {
                queue[rear] = i;
                rear = (rear + 1) % 20;
                count++;
                added[i] = 1;
            }
        }
        if (count == 0) {
            time++;
            continue;
        }
        int current = queue[front];
        front = (front + 1) % 20;
        count--;
        int run = quantum;
        if (rt[current] < quantum) {
            run = rt[current];
        }
        for (int k = 0; k < run; k++) {
            rt[current]--;
            time++;
            for (int j = 0; j < n; j++) {
                if (at[j] == time && added[j] == 0) {
                    queue[rear] = j;
                    rear = (rear + 1) % 20;
                    count++;
                    added[j] = 1;
                }
            }
        }
        if (rt[current] == 0) {
            completed++;
            ct[current] = time;
            tat[current] = ct[current] - at[current];
            wt[current] = tat[current] - bt[current];
        } else {
            queue[rear] = current;
            rear = (rear + 1) % 20;
            count++;
        }
    }

    int totalWT = 0, totalTAT = 0;
    cout << "\nProcess\tAT\tBT\tCT\tTAT\tWT\n";

    for (int i = 0; i < n; i++) {
        cout << "P" << i + 1 << "\t";
        cout << at[i] << "\t";
        cout << bt[i] << "\t";
        cout << ct[i] << "\t";
        cout << tat[i] << "\t";
        cout << wt[i] << endl;

        totalWT += wt[i];
        totalTAT += tat[i];
    }

    cout << "\nAverage WT = " << (float)totalWT / n;
    cout << "\nAverage TAT = " << (float)totalTAT / n << endl;

    return 0;
}
