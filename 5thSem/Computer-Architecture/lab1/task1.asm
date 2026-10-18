.data
    num1:       .word 12
    num2:       .word 4
    sub_msg:    .asciiz "Difference (12 - 4) = "
    mul_msg:    .asciiz "\nProduct (12 * 4) = "

.text
.globl main
main:
    lw $t0, num1
    lw $t1, num2

    sub $t2, $t0, $t1
    mul $t3, $t0, $t1

    li $v0, 4
    la $a0, sub_msg
    syscall

    li $v0, 1
    move $a0, $t2
    syscall

    li $v0, 4
    la $a0, mul_msg
    syscall

    li $v0, 1
    move $a0, $t3
    syscall

    li $v0, 10
    syscall
