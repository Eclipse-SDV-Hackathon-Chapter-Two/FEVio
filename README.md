# FEVio

This repository includes the source code, information and documentation created by the FEV.io team that solves the challenge "Play by Wire" in the Eclipse SDV Hackathon 2024.

The overall architecture with the most important hardware and software elements is depicted below.

![Solution Architecture](./sdv_solution_architecture.png)

# Cloning
Either specify while cloning `--recurse-submodules` to download the submodules or alternatively update it afterward.

```shell
git submodule init
git submodule update --recursive
```

# OpenOCD

[OpenOCD](https://github.com/openocd-org/openocd) is used to flash the MXChip AZ3166.

```shell
./bootstrap
./configure
make
sudo make install 
```

## Flashing

openocd -f board/stm32f4discovery.cfg -c "program ../build/app/mxchip_threadx.elf verify reset exit"
