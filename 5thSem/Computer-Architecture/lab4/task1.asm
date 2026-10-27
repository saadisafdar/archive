.data
    msg: .asciiz "Factorial of 5 is: "

.text
.globl main

main:
    li $t0, 5           
    li $t1, 1           

loop:
    blez $t0, exit
    mul $t1, $t1, $t0
    sub $t0, $t0, 1
    j loop

exit:
    li $v0, 4           
    la $a0, msg
    syscall

    li $v0, 1           
    move $a0, $t1
    syscall

    li $v0, 10
    syscall
