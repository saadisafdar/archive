#include<iostream> 
#include<unistd.h> 
#include<sys/wait.h> 
using namespace std;
int main()
{
pid_t pid=fork();
if(pid==0)
{
cout<<"Child: my PID is"<<getpid()<<", my parent is"<<getppid()<<endl;
}
else
{
wait(nullptr);
cout<<"Parent: my PID is "<<getpid()<<", my child was"<<pid<<endl;
}
return 0;
}
