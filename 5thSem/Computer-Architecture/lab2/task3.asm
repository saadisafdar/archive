.data
x: .word 37
y: .word 24
z: .word 9
res1: .word 0
res2: .word 0
res3: .word 0

.text
.globl main
main:
la $t0, x
la $t1, y
la $t2, z
la $s1, res1
la $s2, res2
la $s3, res3

lw $t3, 0($t0)
lw $t4, 0($t1)
lw $t5, 0($t2)

add $t6, $t3, $t4
sw $t6, 0($s1)

mul $t7, $t6, $t5
sw $t7, 0($s2)

sub $t8, $t7, $t4
sw $t8, 0($s3)

li $v0, 10
syscall
