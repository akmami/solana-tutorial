# Solana Tutorial

# Introduction

This repository is created for Rust Tutorial. Also, it contains valuable informations and explanations for Solana Blockchain. The official Udemy course can be found [here](https://www.udemy.com/course/solana-developer/)

## Setup

### Rust and Cargo

The following documentation is retrieved from [here](https://doc.rust-lang.org/cargo/getting-started/installation.html).

The easiest way to get Cargo is to install the current stable release of Rust by using rustup. Installing Rust using rustup will also 
install cargo.

On Linux and macOS systems, this is done as follows:

```
curl https://sh.rustup.rs -sSf | sh
```

If you encountered with a permission error for path, run program without adding path automatically.

```
curl https://sh.rustup.rs -sSf | bash -s -- -y --no-modify-path
```

For installation option, select option 1 which is the default installation.

In order to add rust to your path (if you downloaded with --no-modify-path option), add following line to your PATH

```
PATH="~/.cargo/bin:$PATH"
```

and restart your terminal.

Run following commands seperately to make sure that rust, its compiler and cargo are installed.

```
rustup --version
```

```
rustc --version
```

```
cargo --version
```

### Solana

Please install Solana first in your machine. You can follow the instructions given 
[here](https://docs.solana.com/cli/install-solana-cli-tools).

Make sure solana is installed

``` 
solana --version
```

You may encounter with PATH problem here so add it if it's asked and restart your terminal.

```
PATH="~/.local/share/solana/install/active_release/bin:$PATH"
```

Since there are many other versions will be available in the future, the commands are not provided and official documentation is 
provided.

If you want to set Solana to your local network, run following commands:

```
solana config set --url localhost
```

Check the configuration with:

```
solana config get
```

### Solana Program Library

This program defines a common implementation for Fungible and Non Fungible tokens. The official site can be found [here](https://spl.solana.com/token)

```
cargo install spl-token-cli
```

