export const notFound = () => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={NotFoundStyles}
      closeTimeoutMS={200}
      shouldCloseOnOverlayClick={false}
      contentLabel='Adjust'
      portalClassName='notFound'
    >
      <ModalHeader notFound ModalBackground={ModeThemes[theme].ModalBackground}>
        <button onClick={() => closeModal()}>
          <img src={theme === 'light' ? CloseModal : CloseModalWhite} alt='' />
        </button>
      </ModalHeader>
      {type === 'SLICE/DAI LP' || type === 'SLICE/ETH LP' ? (
        <SliceNotFound ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText}>
          <p>{i18n.t('stake.modal.DontHaveSliceLP')}</p>
          <SliceNotFoundBtn color='#1E80DA' ModalBackground={ModeThemes[theme].SelectedStaking}>
            <a
              href='https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1'
              target='_blank'
              rel='noopener noreferrer'
            >
              {i18n.t('stake.modal.getSliceLP')}
            </a>
          </SliceNotFoundBtn>
        </SliceNotFound>
      ) : (
        <SliceNotFound ModalBackground={ModeThemes[theme].ModalBackground} ModalText={ModeThemes[theme].ModalText}>
          <p>{i18n.t('stake.modal.DontHaveSlice')}</p>
          <SliceNotFoundBtn color='#4441CF' ModalBackground={ModeThemes[theme].SelectedStaking}>
            <a
              href='https://app.uniswap.org/#/swap?outputCurrency=0x0aee8703d34dd9ae107386d3eff22ae75dd616d1'
              target='_blank'
              rel='noopener noreferrer'
            >
              {i18n.t('stake.modal.getSlice')}
            </a>
          </SliceNotFoundBtn>
        </SliceNotFound>
      )}
    </Modal>
  );
};