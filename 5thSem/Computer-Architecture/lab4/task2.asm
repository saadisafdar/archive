.data
    data:   .word 12, 45, 7, 32, 28, 51, 19
    maxval: .word 0
    count:  .word 0

    msg_max: .asciiz "Maximum: "
    msg_cnt: .asciiz "\nCount: "

.text
.globl main

main:
    la $t0, data
    li $t1, 7
    li $t2, 0
    li $t3, 0

loop:
    beq $t1, $zero, end

    lw $t4, 0($t0)
    addi $t2, $t2, 1

    ble $t4, $t3, next
    move $t3, $t4

next:
    addi $t0, $t0, 4
    addi $t1, $t1, -1
    j loop

end:
    sw $t3, maxval
    sw $t2, count

    li $v0, 4
    la $a0, msg_max
    syscall

    li $v0, 1
    lw $a0, maxval
    syscall

    li $v0, 4
    la $a0, msg_cnt
    syscall

    li $v0, 1
    lw $a0, count
    syscall

    li $v0, 10
    syscall
