.data
.text
.globl main
main:
    li $t0, 2
    li $t1, 20

loop:
    bgt $t0, $t1, end

    move $a0, $t0
    li $v0, 1
    syscall
    
    li $a0, 10
    li $v0, 11
    syscall

    addi $t0, $t0, 2
    j loop

end:
    li $v0, 10
    syscall

