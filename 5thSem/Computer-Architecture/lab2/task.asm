.data
w1: .word 15
w2: .word 25
res: .word 0

.text
.globl main
main:

la $t0, w1

lw $t1, 0($t0)
lw $t2, 4($t0)

add $t3, $t1, $t2

sw $t3, 8($t0)

li $v0, 10
syscall
