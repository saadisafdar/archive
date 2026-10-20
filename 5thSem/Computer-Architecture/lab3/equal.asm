.data
num1: .word 10
num2: .word 10
result: .word 0

.text
.globl main
main:

lw $t0, num1
lw $t1, num2

beq $t0, $t1, equal

li $t2, 0
j end

equal:
li $t2, 1

end:
sw $t2, result
lw $a0, result

li $v0, 1
syscall

li $v0, 10
syscall
