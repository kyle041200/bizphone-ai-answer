<?php
// QA-only MU helper. Never install on a customer/production WordPress website.
if(!defined('ABSPATH')||!in_array(parse_url(home_url(),PHP_URL_HOST),['localhost','127.0.0.1'],true))return;
add_filter('pre_http_request',function($pre,$args,$url){$host=parse_url($url,PHP_URL_HOST);$worker=defined('KGHQ_WORKER_URL')?parse_url(KGHQ_WORKER_URL,PHP_URL_HOST):null;if(!in_array($host,['localhost','127.0.0.1',$worker],true))return new WP_Error('kghq_qa_offline','External WordPress HTTP disabled for consistent staging tests.');return $pre;},10,3);
add_action('http_api_curl',function($handle,$args,$url){if(defined('KGHQ_WORKER_URL')&&parse_url($url,PHP_URL_HOST)===parse_url(KGHQ_WORKER_URL,PHP_URL_HOST))curl_setopt($handle,CURLOPT_PROXY,'');},10,3);
