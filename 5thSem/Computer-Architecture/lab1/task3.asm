.data
    num1:       .word 12
    num2:       .word 5
    
    and_msg:    .asciiz "AND Result (12 & 5)  = "
    or_msg:     .asciiz "\nOR Result  (12 | 5)  = "
    xor_msg:    .asciiz "\nXOR Result (12 ^ 5)  = "

.text
.globl main
main:
    lw $t0, num1
    lw $t1, num2

    and $t2, $t0, $t1
    or  $t3, $t0, $t1
    xor $t4, $t0, $t1

    li $v0, 4
    la $a0, and_msg
    syscall

    li $v0, 1
    move $a0, $t2
    syscall

    li $v0, 4
    la $a0, or_msg
    syscall

    li $v0, 1
    move $a0, $t3
    syscall

    li $v0, 4
    la $a0, xor_msg
    syscall

    li $v0, 1
    move $a0, $t4
    syscall

    li $v0, 10
    syscall
