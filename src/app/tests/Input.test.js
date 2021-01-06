import React from 'react';
import { shallow } from 'enzyme';
import InputField from '../components/Form/Input';



describe('<InputField />', () => {
    const InputProps = {
        input: "",
        type: "",
        className: "",
        meta:{
            touched: true,
            error: ""
        }
    }

    it('has an input field', ()=>{
        let wrapper = shallow(<InputField {...InputProps} />);
        console.log('------------')
        console.log(wrapper.debug())
        console.log('------------')
        const input = wrapper.find('input')
        expect(input.props().value).toBe(undefined)
    })
})