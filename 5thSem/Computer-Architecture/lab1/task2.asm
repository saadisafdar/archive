.data
    prompt:     .asciiz "Enter a positive integer: "
    result_msg: .asciiz "Factorial = "

.text
.globl main
main:
    li $v0, 4
    la $a0, prompt
    syscall

    li $v0, 5
    syscall
    move $t0, $v0

    li $t1, 1
    move $t2, $t0

factorial_loop:
    blez $t2, print_fact
    mul $t1, $t1, $t2
    addi $t2, $t2, -1
    j factorial_loop

print_fact:
    li $v0, 4
    la $a0, result_msg
    syscall

    li $v0, 1
    move $a0, $t1
    syscall

    li $v0, 10
    syscall
