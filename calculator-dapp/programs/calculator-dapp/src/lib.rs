use anchor_lang::prelude::*;

declare_id!("EhZeBdPwAcsmrqdRMsQMam2fbqEffsGM9RyjMJRPoaQt");

#[program]
pub mod calculator_dapp {
    use super::*;
    
    // Since there is no stored data, account is required as ctx is required
    pub fn create(ctx: Context<Create>, init_message: String) -> Result<()> {
        let calculator = &mut ctx.accounts.calculator;
        calculator.greeting = init_message;
        Ok(())
    }

    // Add function
    pub fn add(ctx: Context<Addition>, num1: i64, num2: i64) -> Result<()> {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 + num2;
        Ok(())
    }

    // Subtraction function
    pub fn subtract(ctx: Context<Subtraction>, num1: i64, num2: i64) -> Result<()> {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 - num2;
        Ok(())
    }

    // Multiplication function
    pub fn multiply(ctx: Context<Multiplication>, num1: i64, num2: i64) -> Result<()> {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 * num2;
        Ok(())
    }

    // Division function
    pub fn divide(ctx: Context<Division>, num1: i64, num2: i64) -> Result<()> {
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = num1 / num2;
        calculator.remainder = num1 % num2;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer=user, space=264)] // space allocation in solana, needed only for creation
    pub calculator: Account<'info, Calculator>, // representing Calculator account

    #[account(mut)] // make it muttable
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Addition<'info> {
    #[account(mut)] // this function is muttable since we modifying it in calculator.result
    pub calculator: Account<'info, Calculator>
}

#[derive(Accounts)]
pub struct Subtraction<'info> {
    #[account(mut)] // this function is muttable since we modifying it in calculator.result
    pub calculator: Account<'info, Calculator>
}

#[derive(Accounts)]
pub struct Multiplication<'info> {
    #[account(mut)] // this function is muttable since we modifying it in calculator.result
    pub calculator: Account<'info, Calculator>
}

#[derive(Accounts)]
pub struct Division<'info> {
    #[account(mut)] // this function is muttable since we modifying it in calculator.result
    pub calculator: Account<'info, Calculator>
}

#[account]
pub struct Calculator {
    pub greeting: String,
    pub result: i64,
    pub remainder: i64
}

