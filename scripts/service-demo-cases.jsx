import React from 'react';
import { create, act } from 'react-test-renderer';
import assert from 'node:assert/strict';
import { C } from '../src/context.jsx';
import { ServiceDemo } from '../src/components/ServiceDemo.jsx';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
for (const lang of ['en', 'pt']) {
  for (const customer of [0, 1]) for (const buyer of [0, 1]) for (const consent of [false, true]) {
    let view;
    await act(() => { view = create(<C value={{lang}}><ServiceDemo /></C>); });
    const click = async index => { await act(() => view.root.findAllByType('button')[index].props.onClick()); };
    await click(0); await click(customer); await click(buyer); await click(consent ? 0 : 1);
    if (consent) {
      await act(() => view.root.findByProps({id:'nova-name'}).props.onChange({target:{value:'Demo Visitor'}}));
      await act(() => view.root.findByProps({id:'nova-email'}).props.onChange({target:{value:'visitor@example.com'}}));
      await act(() => view.root.findByType('form').props.onSubmit({preventDefault(){}}));
    } else assert.equal(view.root.findAllByType('input').length, 0);
    await act(() => view.root.findByType('form').props.onSubmit({preventDefault(){}}));
    assert.equal(view.root.findAllByType('textarea').length, 1, 'empty request cannot advance');
    await act(() => view.root.findByType('textarea').props.onChange({target:{value:'Sample brake pads request'}}));
    await act(() => view.root.findByType('form').props.onSubmit({preventDefault(){}}));
    assert.equal(view.root.findByProps({role:'status'}).children.length, 1);
    assert.equal(view.root.findAllByType('li').length, consent ? 8 : 7);
    assert.ok(JSON.stringify(view.toJSON()).includes('DEMO-001'));
    await act(() => view.update(<C value={{lang:lang === 'en' ? 'pt' : 'en'}}><ServiceDemo /></C>));
    assert.ok(JSON.stringify(view.toJSON()).includes('Sample brake pads request'));
    await click(0);
    assert.equal(view.root.findAllByType('li').length, 0);
    assert.ok(!JSON.stringify(view.toJSON()).includes('Sample brake pads request'));
    await act(() => view.unmount());
  }
}
console.log('PASS: 16 complete flows, consent branches, empty request, language switching and reset.');
