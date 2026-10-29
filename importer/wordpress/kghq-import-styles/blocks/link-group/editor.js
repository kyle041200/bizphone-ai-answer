/* global wp */
(() => {
 const h=wp.element.createElement,{useBlockProps,InnerBlocks,InspectorControls}=wp.blockEditor;
 wp.blocks.registerBlockType('kghq/link-group',{
  apiVersion:3,title:'KGHQ Linked Layout',category:'design',icon:'admin-links',
  attributes:{url:{type:'string',default:''},linkTarget:{type:'string',default:''},rel:{type:'string',default:''}},
  supports:{html:false,anchor:true,color:{text:true,background:true,gradients:true},spacing:{padding:true,margin:true,blockGap:true},typography:{fontSize:true,lineHeight:true},__experimentalBorder:{radius:true}},
  edit:({attributes,setAttributes})=>h(wp.element.Fragment,null,
   h(InspectorControls,null,h(wp.components.PanelBody,{title:'Linked layout'},
    h(wp.components.TextControl,{label:'Destination URL',value:attributes.url,onChange:url=>setAttributes({url})}),
    h(wp.components.ToggleControl,{label:'Open in a new tab',checked:attributes.linkTarget==='_blank',onChange:on=>setAttributes({linkTarget:on?'_blank':'',rel:on?'noopener noreferrer':''})}))),
   h('div',useBlockProps({className:'kghq-linked-layout-editor'}),h(InnerBlocks))),
  save:({attributes})=>h('a',useBlockProps.save({href:attributes.url||undefined,target:attributes.linkTarget||undefined,rel:attributes.rel||undefined}),h(InnerBlocks.Content))
 });
})();
