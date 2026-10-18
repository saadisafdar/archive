
.data
a: .word 15
varb: .word 8
res: .word 0

.text
.globl main
main:

la $t0, a
la $t1, varb
la $t2, res

lw $t3, 0($t0)
lw $t4, 4($t1)

add $t5, $t3, $t4

sw $t5, 0($t2)

li $v0, 10
syscall
