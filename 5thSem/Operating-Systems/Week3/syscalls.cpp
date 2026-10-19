#include<iostream>
#include<fcntl.h>
#include<string>
#include<unistd.h>
using namespace std;
int main()
{
char buf[100];
string msg1="using write() directly\n";
write(1,msg1.c_str(),msg1.size());

int fd=open("note.txt", O_WRONLY|O_CREAT|O_TRUNC,0644);
string msg2="hello from syscalls\n";
write(fd,msg2.c_str(),msg2.size());
close(fd);

fd=open("note.txt", O_RDONLY);
ssize_t n=read(fd,buf,sizeof(buf));
close(fd);

write(1,buf,n);
return 0;
}
