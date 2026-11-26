#include<iostream>
#include<algorithm>
using namespace std;

int main()
{
	int n, at[20], bt[20], wt[20], ct[20], tat[20], pid[20];
	int time, totalWT = 0, totalTAT = 0;
	cout<<"Enter Number of processes: ";
	cin>>n;

	for(int i=0; i<n; i++){
		pid[i] = i + 1;
		cout<<"Enter AT and BT of P"<<pid[i]<<":";
		cin>>at[i]>>bt[i];
	}

	for(int i=0; i<n; i++)
		for(int j=0; j<n-i-1; i++)
			if(at[j]>at[j+1]){
				swap(at[j], at[j+1]);
				swap(bt[j], bt[j+1]);
				swap(pid[j], pid[j+1]);
			}

	for(int i=0; i<n; i++){
		if(time < at[i])
		time=at[i];
		wt[i] = time - at[i];
		time += bt[i];
		ct[i] = time;
		tat[i] = ct[i] - at[i];
		totalWT += wt[i];
		totalTAT += tat[i];
	}

	cout<<"\nProcess\tAT\tBT\tCT\tTAT\tWT\n";
	for(int i=0; i<n; i++)
		cout<<"p"<<pid[i]<<"\t"<<at[i]<<"\t"<<bt[i]<<"\t"<<ct[i]<<"\t"<<tat[i]<<"\t"<<wt[i]<<endl;
	cout<<"\nAverage WT = "<<(float)totalWT/n;
	cout<<"\nAverage TAT = "<<(float)totalTAT/n;
	return 0;
}
