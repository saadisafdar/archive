#include <iostream>
using namespace std;
int main() {
    int n, at[20], bt[20], rt[20], ct[20], tat[20], wt[20];
    int completed = 0, time = 0, totalWT = 0, totalTAT = 0;
    cout << "Enter number of processes: ";
    cin >> n;
    for (int i = 0; i < n; i++) {
        cout << "Enter AT and BT of P" << i + 1 << ": ";
        cin >> at[i] >> bt[i];
        rt[i] = bt[i];
    }
    while (completed < n) {
        int shortest = -1, minRT = 9999;

        for (int j = 0; j < n; j++) {
            if (at[j] <= time && rt[j] > 0 && rt[j] < minRT) {
                minRT = rt[j];
                shortest = j;
            }
        }
        if (shortest == -1) {
            time++;
            continue;
        }
        rt[shortest]--;
        time++;

        if (rt[shortest] == 0) {
            completed++;
            ct[shortest] = time;
            tat[shortest] = ct[shortest] - at[shortest];
            wt[shortest] = tat[shortest] - bt[shortest];
        }
    }

    cout << "\nProcess\tAT\tBT\tCT\tTAT\tWT\n";
    for (int i = 0; i < n; i++) {
        cout << "P" << i + 1 << "\t" << at[i] << "\t"
             << bt[i] << "\t" << ct[i] << "\t"
             << tat[i] << "\t" << wt[i] << endl;
        totalWT += wt[i];
        totalTAT += tat[i];
    }

    cout << "\nAverage WT = " << (float)totalWT / n;
    cout << "\nAverage TAT = " << (float)totalTAT / n << endl;

    return 0;
}
