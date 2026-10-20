.data
sum: .word 0

.text
.globl main
main:
    li $t0, 1
    li $t1, 10
    li $t2, 0

loop:
    bgt $t0, $t1, res

    add $t2, $t2, $t0
    addi $t0, $t0, 1
    j loop

res:
    sw $t2, sum
    lw $a0, sum
    li $v0, 1
    syscall

    li $v0, 10
    syscall

