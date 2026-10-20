.data
n1: .word 17
n2: .word 9
n3: .word 23
smallest: .word 0

.text
.globl main
main:
    lw $t0, n1
    lw $t1, n2
    lw $t2, n3

    move $t3, $t0

    ble $t1, $t3, set_b
    j check_c

set_b:
    move $t3, $t1

check_c:
    ble $t2, $t3, set_c
    j res

set_c:
    move $t3, $t2

res:
    sw $t3, smallest
    lw $a0, smallest
    li $v0, 1
    syscall
    li $v0, 10
    syscall

