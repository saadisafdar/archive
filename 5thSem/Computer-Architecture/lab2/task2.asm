
.data
a: .word 25
varb: .word 15
sum: .word 0
diff: .word 0

.text
.globl main
main:

la $t0, a
la $t1, varb
la $t2, sum
la $t3, diff

lw $t4, 0($t0)
lw $t5, 0($t1)

add $t6, $t4, $t5
sub $t7, $t4, $t5

sw $t6, 0($t2)
sw $t7, 0($t3)

li $v0, 10
syscall
