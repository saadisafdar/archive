.data
num1: .word 30
num2: .word 30
flag: .word 0

.text
.globl main
main:

lw $t0, num1
lw $t1, num2

bne $t0, $t1, notequal

li $t2, 0
j end

notequal:
li $t2, 1

end:
sw $t2, flag
lw $a0, flag

li $v0, 1
syscall

li $v0, 10
syscall
