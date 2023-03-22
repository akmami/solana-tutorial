use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use chainlink_solana as chainlink;
use anchor_lang::solana_program::system_program;

declare_id!("HB6ic4urTYPYQ4UXmX6uejy6ARbPwpw47f5vZLVGnmDH");

#[program]
pub mod chainlink_solana_dapp {
    use super::*;

    pub fn execute(_ctx: Context<Execute>) -> ProgramResult {
        let round = chainlink::latest_round_data(
            _ctx.accounts.chainlink_program.to_account_info(),
            _ctx.accounts.chainlink_feed.to_account_info()
        )?;
        let result_account = &mut _ctx.accounts.result_account;
        result_account.value = round.answer;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(init, payer=user, space=100)]
    pub result_account: Account<'info, ResultAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(address = system_program::ID)]
    /// CHECK:
    pub system_program: AccountInfo<'info>,
    /// CHECK:
    pub chainlink_program: AccountInfo<'info>,
    /// CHECK:
    pub chainlink_feed: AccountInfo<'info>
}

#[account]
pub struct ResultAccount {
    pub value: i128
}